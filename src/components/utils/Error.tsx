import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function Error({ error }: { error: Error }) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
        </Alert>
    )
};