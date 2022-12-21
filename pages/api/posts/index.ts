import formidable from 'formidable';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import cloudinary from '../../../lib/cloudinary';
import dbConnect from '../../../lib/dbConnect';
import {
  formatPosts,
  isAdmin,
  readFile,
  readPostsFromDb,
} from '../../../lib/utils';
import { postValidationSchema, validateSchema } from '../../../lib/validator';
import Post from '../../../models/Post';
import { FinalPost, UserProfile } from '../../../utils/types';
import { authOptions } from '../auth/[...nextauth]';

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case 'GET':
      return readPosts(req, res);
    case 'POST':
      return createNewPost(req, res);
  }
};

const createNewPost: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res);
  if (!admin) return res.status(401).json({ error: 'unauthorized request!' });

  const { files, body } = await readFile<FinalPost>(req);

  // tags will be in string form so need to convert to array
  let tags = [];
  if (body.tags) tags = JSON.parse(body.tags as string);

  const error = validateSchema(postValidationSchema, { ...body, tags });

  if (error) return res.status(400).json({ error });

  const { title, content, slug, meta } = body;

  await dbConnect();
  const alreadyExistPost = await Post.findOne({ slug });
  if (alreadyExistPost)
    return res.status(400).json({ error: 'Slug need to be unique' });

  // create a new post
  const newPost = new Post({
    title,
    content,
    slug,
    meta,
    tags,
  });

  //uploading thumbnail if there is any
  const thumbnail = files.thumbnail as formidable.File;
  if (thumbnail) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      thumbnail.filepath,
      {
        folder: 'gidgud-blog',
      }
    );

    newPost.thumbnail = { url, public_id };
  }

  await newPost.save();

  res.json({ ok: true, post: newPost });
};

const readPosts: NextApiHandler = async (req, res) => {
  try {
    const { limit, pageNumber, skip } = req.query as {
      limit: string;
      pageNumber: string;
      skip: string;
    };
    const posts = await readPostsFromDb(
      parseInt(limit),
      parseInt(pageNumber),
      parseInt(skip)
    );

    if (!posts) return res.status(500).json({ error: 'No post available' });
    res.json({ posts: formatPosts(posts) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
