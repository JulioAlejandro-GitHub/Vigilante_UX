import { Request, Response } from 'express';
export declare const getEventsGrouped: (req: Request, res: Response) => Promise<void>;
export declare const getEvents: (req: Request, res: Response) => Promise<void>;
export declare const updateEventSubject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=eventController.d.ts.map