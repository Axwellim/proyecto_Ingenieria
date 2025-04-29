<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB; // Usamos DB para las consultas SQL crudas

class funciones extends Model
{
    public function verificarCredenciales($nombre, $contrasena)
    {
        return \DB::table('tbl_usuarios')
                 ->where('usu_correo', $nombre)
                 ->where('usu_contrasena', $contrasena)
                 ->first(); // Devuelve el primer resultado o null
    }


    public function insertar($nombres, $correo, $contrasena)
    {
        DB::table('tbl_usuarios')->insert([
            'usu_nombres' => $nombres,
            'usu_correo' => $correo,
            'usu_contrasena' => $contrasena,
            'usu_estado' => 1,
        ]);
    }
    


    

    
}

