'use client'

import { useState } from 'react'
import type { User } from "@/lib/graphql/types/user"
import { ME } from "@/lib/graphql/queries/user"
import { useMe } from '@/lib/graphql/hooks/useUser'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Edit3 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation } from "@apollo/client/react"
import { UPDATE_PROFILE } from "@/lib/graphql/mutations/user"

const categories = ["Frontend",
  "Backend",
  "Design",
  "Mobile",
  "Artista 2d",
  "Artista 3d",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Game Developer",
  "UI/UX",
  "Product Manager",
  "Scrum Master",
  "Cybersecurity",
  "Cloud",
  "Fullstack",
  "Blockchain",
  "Embedded Systems",
  "AR/VR"]

interface ProfileFormData {
	name: string
	email: string
	bio: string
	area: string
	contact: string
}

interface EditProfileDialogProps {
	isOpen?: boolean
	onOpenChange?: (open: boolean) => void
}

export function EditProfileDialog({
	isOpen,
	onOpenChange,
}: EditProfileDialogProps) {

	const [updateProfile] = useMutation<
		{ updateProfile: User },
		{ avatar?: string; description?: string; area?: string; contact?: string }
	>(UPDATE_PROFILE, {
		update(cache, { data }) {
			if (!data?.updateProfile) return

			const existing = cache.readQuery<{ me: User }>({
				query: ME,
			})

			if (!existing?.me) return

			cache.writeQuery({
				query: ME,
				data: {
					me: {
						...existing.me,
						...data.updateProfile,
					},
				},
			})
		},
	})

	const [open, setOpen] = useState(isOpen ?? false)
	const [isSaving, setIsSaving] = useState(false)

	const { data } = useMe()
	const initial = data?.me

	const form = useForm<ProfileFormData>({
		defaultValues: {
			name: initial?.name ?? "",
			email: initial?.email ?? "",
			bio: initial?.description ?? "",
			area: initial?.area ?? "",
			contact: initial?.contact ?? "",
		},
	})

	if (!initial) {
		return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
	}

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen)
		onOpenChange?.(newOpen)
	}

	async function onSubmit(data: ProfileFormData) {
		setIsSaving(true)

		try {
			const { data: res } = await updateProfile({
				variables: {
					avatar: undefined,
					description: data.bio,
					area: data.area,
					contact: data.contact,
				},
			})

			const updated = res?.updateProfile

			if (!updated) return

			setOpen(false)

			form.reset({
				name: updated.name,
				email: initial?.email ?? "",
				bio: updated.description ?? "",
				area: updated.area ?? "",
				contact: updated.contact ?? "",
			})

		} finally {
			setIsSaving(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-1.5 btn-press transition-all duration-200 hover:border-gold/40 w-full justify-center"
				>
					<Edit3 className="size-4" />
					Editar perfil
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md animate-scale-in">
				<DialogHeader>
					<DialogTitle className="font-serif text-xl">Editar perfil</DialogTitle>
					<DialogDescription>
						Atualize suas informações de perfil
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome completo</FormLabel>
									<FormControl>
										<Input placeholder="Seu nome" autoComplete="name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="seu@email.com"
											type="email"
											autoComplete="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="area"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Área de atuação</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.slice(1).map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Conte um pouco sobre você e seu trabalho..."
											className="resize-none h-24"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Máximo 500 caracteres
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="contact"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contato</FormLabel>
									<FormControl>
										<Input placeholder="Email ou telefone para contato" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={() => handleOpenChange(false)}
								disabled={isSaving}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								className="flex-1 gap-2 bg-gold text-white hover:bg-gold-light btn-press"
								disabled={isSaving}
							>
								{isSaving ? 'Salvando...' : 'Salvar alterações'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
