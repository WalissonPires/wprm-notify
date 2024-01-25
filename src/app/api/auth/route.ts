
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClientFactory } from '@/common/database/prisma-factory';
import { Login } from '@/domains/auth/use-cases/login';
import { Logout } from '@/domains/auth/use-cases/logout';
import { GetCurrentUser } from '@/domains/auth/use-cases/get-current-user';
import { AppError } from '@/common/error';

export async function GET() {

  const useCase = new GetCurrentUser();
  const user = await useCase.execute();
  return Response.json(user);
}

export async function POST(request: NextRequest, response: NextResponse) {

  const { email, password } = await request.json() as Model;

  const useCase = new Login({
    prismaClient: PrismaClientFactory.create()
  });

  const user = await useCase.execute({ email, password });

  if (!user)
    return Response.json(new AppError('Email/Senha inválido'), { status: 401 });

  return Response.json(user);
}

export async function DELETE() {

  const useCase = new Logout();
  await useCase.execute();

  return new Response(null, { status: 204 });
}


interface Model {
  email: string;
  password: string;
}