// src/utils/validationSchema.js
import { z } from 'zod';


const fileSchema = z.instanceof(File, { message: "Required" });

const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);


// const schema = z.object({
//   image: imageSchema.refine((file) => file.size > 0, "Image Required"),
// });
