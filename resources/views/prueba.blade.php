<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página con Input y Botón</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .container {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        input {
            padding: 10px;
            margin: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Formulario Simple</h2>
        
        <!-- Mostrar mensaje de éxito si está disponible -->
        @if(session('success'))
            <p style="color: green;">{{ session('success') }}</p>
        @endif

        <!-- Formulario para enviar los datos -->
        <form action="{{ route('guardarDato') }}" method="POST">


            @csrf <!-- Token CSRF para protección -->
            <input type="text" name="da_texto" id="userInput" placeholder="Ingresa algo..." required>
            <button type="submit">Enviar</button>
        </form>
    </div>

</body>
</html>
