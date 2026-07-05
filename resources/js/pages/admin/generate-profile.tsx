import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import profiles from '@/routes/admin/profiles';

type StudentOption = {
    id: number;
    name: string;
    student_number: string;
    programme: string;
    level: string;
    graded_units: number;
    latest_profile_at: string | null;
};

type Props = {
    students: StudentOption[];
};

export default function GenerateProfile({ students }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        student_id: string;
    }>({ student_id: '' });

    const selected = students.find(
        (student) => String(student.id) === data.student_id,
    );

    const totalUnits = 15;
    const incomplete = selected !== undefined && selected.graded_units < totalUnits;

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post(profiles.store.url());
    };

    return (
        <>
            <Head title="Generate Profile" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Generate Competency Profile</h1>
                    <p className="text-sm text-muted-foreground">
                        Run the calculation engine for a selected student (FR11).
                    </p>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Select Student</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="student">Student</Label>
                                <Select
                                    value={data.student_id}
                                    onValueChange={(value) => setData('student_id', value)}
                                >
                                    <SelectTrigger id="student">
                                        <SelectValue placeholder="Select a student..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((student) => (
                                            <SelectItem
                                                key={student.id}
                                                value={String(student.id)}
                                            >
                                                {student.student_number} — {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.student_id} />
                            </div>

                            {selected && (
                                <div className="grid gap-2 rounded-lg border p-4 text-sm sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            Programme
                                        </p>
                                        <p className="font-medium">{selected.programme}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            Level
                                        </p>
                                        <p className="font-medium">{selected.level}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            Units Graded
                                        </p>
                                        <p className="font-medium">
                                            {selected.graded_units} of ~{totalUnits}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            Last Profile
                                        </p>
                                        <p className="font-medium">
                                            {selected.latest_profile_at ?? 'Never generated'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {incomplete && (
                                <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                                    <AlertTriangle className="size-4" />
                                    <AlertDescription>
                                        This student has incomplete grade records (
                                        {selected.graded_units} of ~{totalUnits} units
                                        graded). The generated profile may not reflect their
                                        full competency.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div>
                                <Button
                                    type="submit"
                                    disabled={data.student_id === '' || processing}
                                    className="bg-[#1e40af] hover:bg-[#1e3a8a]"
                                >
                                    {processing && <Spinner />}
                                    Generate Profile
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

GenerateProfile.emsTitle = 'Generate Profile';
