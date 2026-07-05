<?php

use App\Models\User;

test('guests landing on the root are sent to login (FR1)', function () {
    $this->get(route('home'))->assertRedirect(route('login'));
});

test('authenticated users landing on the root are sent to their dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('home'))->assertRedirect(route('dashboard'));
});
