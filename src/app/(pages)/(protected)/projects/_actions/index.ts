"use server";

import prisma from "@/helpers/db";
import { createFormSchema, CreateFormSchema } from "../_schemas";
import { CreateProjectReturnType } from "../_types";
import { validateRequest } from "@/lucia";
import { revalidatePath } from "next/cache";

export async function createProjectAction(
  values: CreateFormSchema
): Promise<CreateProjectReturnType> {
  try {
    const validationResult = createFormSchema.safeParse(values);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        success: false,
        errors: {
          boardName: fieldErrors?.boardName?.[0],
          projectName: fieldErrors?.projectName?.[0],
        },
      };
    }

    const { projectName, boardName } = validationResult.data;
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        errors: {
          root: "Error occured while creating project",
        },
      };
    }
    const project = await prisma.project.create({
      data: {
        name: projectName,
        role: "OWNER",
        userId: user.id,
        boards: { create: [{ name: boardName }] },
      },
    });
    revalidatePath("/projects");
    return { success: true, message: `Created ${project.name}` };
  } catch (err) {
    console.log(err);
    return { success: false, errors: { root: "Internal Server Error" } };
  }
}

export async function toggleFavorite(projectId: string) {
  await prisma.$transaction(async (tx) => {
    const result = await prisma.project.findUnique({
      where: { id: projectId },
      select: { starred: true },
    });
    await tx.project.update({
      where: { id: projectId },
      data: { starred: !result?.starred },
    });
  });
  revalidatePath("/projects");
}
