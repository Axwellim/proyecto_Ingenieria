<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Tymon\JWTAuth\Facades\JWTAuth;

class controlador extends Controller
    {
        public function loginReact(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);
    
    }
    

    public function registerReact(Request $request)
    {
        $request->validate([
            'nombres' => 'required|string|max:100',
            'correo' => 'required|email|unique:tbl_usuarios,usu_correo',
            'contrasena' => 'required|string|min:3',
        ]);
    }
    }