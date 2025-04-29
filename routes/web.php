<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\controlador; // Importar el controlador

/*
|----------------------------------------------------------------------
| Web Routes
|----------------------------------------------------------------------
|
| Aquí puedes registrar las rutas web para tu aplicación. Estas rutas
| son cargadas por el RouteServiceProvider y todas ellas se asignan al
| grupo de middleware "web". ¡Haz algo increíble!
|
*/

Route::get('/', function () {
    return view('welcome');
});




