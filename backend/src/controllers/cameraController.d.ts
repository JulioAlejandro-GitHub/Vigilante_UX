import { Request, Response } from 'express';
export declare const getCameras: (req: Request, res: Response) => Promise<void>;
export declare const getCameraById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCamera: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCamera: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCamera: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEmpresas: (req: Request, res: Response) => Promise<void>;
export declare const getSucursales: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cameraController.d.ts.map