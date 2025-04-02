"use server"

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemes/form";
import { User, userSchemaType } from "@/schemes/user";
import { currentUser, SessionJSON, UserJSON } from "@clerk/nextjs/server"
import { isErrored } from "stream";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
    const user = await currentUser();

    if (!user) {
      throw new UserNotFoundErr();
    }

    const stats = await prisma.form.aggregate({
        where: {
            // userId: user.id,
        },
        _sum: {
            visits: true,
            submissions: true
        }
    });

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;
    let submissionRate = 0;

    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
    }
    
    const bounceRate = 100 - submissionRate;

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate,
    };
}

export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("form not valid");
    }
    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundErr();
    }

    const { name, description } = data;

    const form = await prisma.form.create({
        data: {
        userId: user.id,
        name,
        description,
        },
    });

    if (!form) {
        throw new Error("something went wrong");
    }

    return form.id;
}

export async function GetForms() {
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr();
    }
  
    return await prisma.form.findMany({
      where: {
        OR: [
          {
            status: 0,
          }, 
          {
            status: 1,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
}

export async function GetFormById(id: number) {
    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.findUnique({
        where: {
            // userId: user.id,
            id,
        },
    });
}

export async function UpdateFormContent(id: number, jsonContent: string) {
    const user = await currentUser();

    if (!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            content: jsonContent
        }
    });
}

export async function PublishForm(id: number) {
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr();
    }
  
    return await prisma.form.update({
      data: {
        published: true,
      },
      where: {
        userId: user.id,
        id,
      },
    });
}

export async function DeleteForm(id: number) {
  return await prisma.form.update({
    data: {
      status: -1,
    },
    where: {
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string, id_clerk: string) {
    const form = await prisma.form.update({
        select: {
          content: true,
        },
        data: {
          visits: {
            increment: 1,
          },
        },
        where: {
          shareURL: formUrl,
        },
    });

    if (form) {
      const formView = await prisma.form.findUnique({
          where: {
            shareURL: formUrl,
          },
      });

      if (formView) {
        const isAnswered = await prisma.formSubmissions.findFirst({
            where: {
              userId: id_clerk,
              formId: formView?.id,
            },
        });

        if (isAnswered)
            return "answered";
      }
    }

    return form;
}

export async function SubmitForm(formUrl: string, content: string) {
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr();
    }

    return await prisma.form.update({
      data: {
        submissions: {
          increment: 1,
        },
        FormSubmissions: {
          create: {
            content,
            userId: user.id,
          },
        },
      },
      where: {
        shareURL: formUrl,
        published: true,
      },
    });
}

export async function GetFormWithSubmissions(id: number) {
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr();
    }
  
    return await prisma.form.findUnique({
      where: {
        // userId: user.id,
        id,
      },
      include: {
        FormSubmissions: true,
      },
    });
}

export async function GetMyForms() {
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr();
    }

    return await prisma.formSubmissions.findMany({
        where: {
          userId: user.id,
        }, 
        include: {
          form: true,
        }
    });
}

export async function VerifyIfUsersExists(id_clerk: string) {
  return await prisma.user.findFirst({
    where: {
      id_clerk: id_clerk,
    },
  })
}

export async function CreateUser(user: UserJSON) {
  const newUser = await prisma.user.create({
    data: {
      id_clerk: user.id,
      name: user.first_name,
      lastName: user.last_name,
    }
  });

  if (!newUser) {
    throw new Error("Something went wrong");
  }
}

export async function CreateUserByLogin(user: SessionJSON) {
  const loggedUser = currentUser();
  console.log(user);
  // const newUser = await prisma.user.create({
  //   data: {
  //     id_clerk: user.id,
  //     name: loggedUser.first_name,
  //     lastName: user.last_name,
  //   }
  // });

  // if (!newUser) {
  //   throw new Error("Something went wrong");
  // }
}