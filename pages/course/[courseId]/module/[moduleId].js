import { useRouter } from 'next/router';

export default function ModulePage() {
    const router = useRouter();
    const { moduleId } = router.query;


    return(
        <div>Module: {moduleId}</div>
    );
}
