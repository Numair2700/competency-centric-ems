<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin-managed student accounts (FR2 — students do not self-register).
 */
class StudentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/students', [
            'students' => Student::with('user:id,name,email')
                ->withCount('gradeRecords')
                ->orderBy('student_number')
                ->get(),
        ]);
    }

    public function store(StudentRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => $request->validated('password'),
                'role' => 'student',
            ]);

            $user->forceFill(['email_verified_at' => now()])->save();

            Student::create([
                'user_id' => $user->id,
                'student_number' => $request->validated('student_number'),
                'programme' => $request->validated('programme'),
                'level' => $request->validated('level'),
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student account created.')]);

        return to_route('admin.students.index');
    }

    public function update(StudentRequest $request, Student $student): RedirectResponse
    {
        DB::transaction(function () use ($request, $student) {
            $student->user->fill([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
            ]);

            if ($request->filled('password')) {
                $student->user->password = $request->validated('password');
            }

            $student->user->save();

            $student->update($request->safe()->only(['student_number', 'programme', 'level']));
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student updated.')]);

        return to_route('admin.students.index');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student deleted.')]);

        return to_route('admin.students.index');
    }
}
