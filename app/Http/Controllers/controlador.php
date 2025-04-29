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
    
        // 👇 Aquí usamos el método del modelo
        $usuario = Usuario::verificarCredenciales($request->email, $request->password);
    
        if (!$usuario) {
            return response()->json(['message' => 'Usuario o contraseña incorrectos'], 401);
        }
    
        $customClaims = [
            'nombre' => $usuario->usu_nombres,
            'correo' => $usuario->usu_correo,
        ];
    
        $token = JWTAuth::claims($customClaims)->fromUser($usuario);
    
        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'token' => $token
        ]);
    }
    

    public function registerReact(Request $request)
    {
        $request->validate([
            'nombres' => 'required|string|max:100',
            'correo' => 'required|email|unique:tbl_usuarios,usu_correo',
            'contrasena' => 'required|string|min:3',
        ]);

        Usuario::create([
            'usu_nombres' => $request->nombres,
            'usu_correo' => $request->correo,
            'usu_contrasena' => $request->contrasena,
            'usu_estado' => 1,
        ]);

        return response()->json(['message' => 'Usuario registrado correctamente']);
    }
}
