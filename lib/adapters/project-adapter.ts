import { Project as GQLProject } from "@/lib/graphql/types/project"
import type { ProjectCardType } from "@/components/project-card"

export function adaptProject(project: GQLProject): ProjectCardType {
	return {
		id: project.id,
		title: project.title,
		description: project.description,
		category: project.category ?? "Outros",
		createdAt: project.createdAt ?? new Date().toISOString(),

		author: {
			id: project.user?.id ?? "unknown",
			name: project.user?.name ?? "Usuário",
			role: project.user?.area ?? "Freelancer",
			bio: project.user?.description ?? "",
			projectCount: project.user?.projectsCount ?? 0,
			followers: project.user?.followersCount ?? 0,
		},

		liked: project.likedByMe ?? false,
		likes: project.likesCount ?? 0,

	    commentsCount: project.commentsCount ?? 0,
		
		comments: (project.comments ?? []).map((c: any) => ({
			id: c.id ?? crypto.randomUUID(),
			text: c.text ?? "",
			createdAt: c.createdAt ?? new Date().toISOString(),
			author: {
				name: c.user?.name ?? "Usuário",
			},
		})),

		image: project.images?.[0] ?? null,
		link: project.link ?? null,
	}
}