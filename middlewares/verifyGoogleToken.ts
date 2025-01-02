// import { type Request, type Response, type NextFunction } from "express";
// import { OAuth2Client } from "google-auth-library";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// declare global {
//   namespace Express {
//     interface Request {
//       humanGoogle?: {
//         id: string;
//         email?: string;
//         name?: string;
//         picture?: string;
//       };
//     }
//   }
// }

// const verifyGoogleToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {

//     const auth = req.headers.authorization;
//     if (!auth) {
//       res.status(401).json({error: "INVALID AUTHORIZATION(H)!"})
//       return;
//     }

//     const token = auth.split(" ")[1]; // Extract the token after 'Bearer'
//     if (!token) {
//       res.status(401).json({ error: "INVALID AUTHORIZATION(T)!" });
//       return;
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();
//     if (!payload) {
//       res.status(401).json({ error: "Invalid token payload" });
//       return;
//     }

  
//     req.humanGoogle = {
//       id: payload.sub,
//       email: payload.email,
//       name: payload.name,
//       picture: payload.picture,
//     };

//     next(); 
    
//   } catch (error: unknown) {

//     if (error instanceof Error) {

//       res.status(401).json({ error: error.message});

//   } else {

//       res.status(500).json({ error: "An unknown error occurred (authorization)" });

//   };
//   }
// };

// export default verifyGoogleToken;