import { Button } from "@/components/ui/button"
import { logout } from "@/lucia"
import { validateRequest } from "@/lucia"

export default async function ProjectsPage() {
    const {session, user} = await validateRequest()
    
    return (
        <div>
            <form action={logout}>
                <Button>Logout</Button>
            </form>
            {JSON.stringify(session)}
            {JSON.stringify(user)}
            <h1>All my projects</h1>
            <h2>I am a protected page</h2>
        </div>
    )
}