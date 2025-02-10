import { Multer } from "multer"; // Just import the Multer module, not `File`

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File; // Use Multer.File to type the file property
    }
  }
}
