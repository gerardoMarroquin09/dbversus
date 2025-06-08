import { ordenes } from "../../../utils/oracle/oracle";
export default defineEventHandler(async (event) => {
    try {
        //actualizamos la orden con el id que viene en la url
        const body = await readBody(event);
        const data = await ordenes.update(body, {
            where: {
                id: event.context.params.id
            }
        });
        return { statusCode: 200, data };
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return (error);
    }
});