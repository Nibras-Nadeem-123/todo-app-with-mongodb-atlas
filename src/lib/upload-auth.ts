// Import necessary types from Next.js
import { NextApiRequest, NextApiResponse } from "next";

// Import ImageKit SDK to interact with ImageKit APIs
import ImageKit from "imagekit";

// Initialize the ImageKit instance with your account's credentials
// WARNING: Never expose privateKey in frontend code! This is safe ONLY in a backend API route
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imagekit: any = new ImageKit({
  publicKey: "public_b78aj+NO8rOf4qHsLnPJxoGLDnk=",   // Your ImageKit public API key
  privateKey: "private_8AaRry0r0djTaQPZoqPW55udqT4=", // Your ImageKit private API key (sensitive!)
  urlEndpoint: "https://ik.imagekit.io/nkz2lvnjd"     // Your unique ImageKit URL endpoint
});

// This is the API route handler for `/api/upload-auth`
// It generates the authentication parameters required by the frontend
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate the authentication parameters for client-side file upload
  const authParams = imagekit.getAuthenticationParameters();

  // Respond with the generated authentication parameters
  res.status(200).json(authParams);
}
