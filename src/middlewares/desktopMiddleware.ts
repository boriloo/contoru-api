import { createMiddleware } from 'hono/factory'
import { supabase } from "../lib/supabase";

export const isSingleDesktopOwner = createMiddleware(async (c, next) => {
    const userId = c.get('userId')
    const desktopId = c.req.param('desktopId')

    try {
        const { data, error } = await supabase
            .from('desktops')
            .select('id')
            .eq('id', desktopId)
            .eq('owner_id', userId)
            .single()

        if (error || !data) {
            return c.json({ error: 'User is not desktop owner' }, 403)
        }

        await next()
    } catch {
        return c.json({ error: 'Server Error.' }, 500)
    }
})

// import { NextFunction, Request, Response } from 'express';
// import { pool } from '../lib/postgres';

// export const isSingleDesktopOwner = async (req: Request, res: Response, next: NextFunction) => {
//     const ownerId = (req as any).userId

//     const desktopId = req.params.desktopId

//     try {
//         const response = await pool.query('SELECT id FROM desktops WHERE id = $1 AND owner_id = $2', [desktopId, ownerId])

//         console.log(response.rows)

//         if (response.rows.length > 0) {
//             console.log('vamos seguir')
//             next();
//         } else {
//             return res.status(403).json({ error: "User is not desktop owner" });
//         }
//     } catch {
//         return res.status(500).json({ error: "Server Error." })
//     }

// }
