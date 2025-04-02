import { CreateUser, CreateUserByLogin, VerifyIfUsersExists } from "@/actions/form";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    const payload: WebhookEvent = await request.json();
    console.log('Aqui')
    console.log(payload);
    // Verificar se evento é do tipo user.created
    // if (payload && payload.type == 'user.created') {
    //     if (!VerifyIfUsersExists(payload.data.id)){
    //         await CreateUser(payload.data);
    //     }

    //     return new Response('', { status: 200 });
    // }

    // if (payload && payload.type == 'session.created' || payload.type == 'session.revoked') {
    //     if (!VerifyIfUsersExists(payload.data.id)){
    //         await CreateUserByLogin(payload.data);
    //     }

    //     //return new Response('', { status: 200 });
    // }
}

export async function GET() {
    return Response.json({ message: 'Hello world!' });
}