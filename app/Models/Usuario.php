<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    protected $table = 'tbl_usuarios'; // Tu tabla real
    protected $primaryKey = 'usu_ide'; // Tu llave primaria real

    public $timestamps = false; // Si no tienes created_at y updated_at

    protected $fillable = [
        'usu_nombres',
        'usu_correo',
        'usu_contrasena',
        'usu_estado',
    ];

    protected $hidden = [
        'usu_contrasena',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public static function verificarCredenciales($correo, $contrasena)
{
    return self::where('usu_correo', $correo)
               ->where('usu_contrasena', $contrasena)
               ->first();
}

}
