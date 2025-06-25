import { NextApiRequest, NextApiResponse } from "next";
import ImageKit from "imagekit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imagekit: any = new ImageKit({
  publicKey: "public_b78aj+NO8rOf4qHsLnPJxoGLDnk=",
  privateKey: "private_8AaRry0r0djTaQPZoqPW55udqT4=",
  urlEndpoint: "https://ik.imagekit.io/nkz2lvnjd"
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authParams = imagekit.getAuthenticationParameters();
  res.status(200).json(authParams);
}
