# Projet Génération Procédurale

- [Project Subject Page](https://www.labri.fr/perso/renault/working/teaching/projets/2020-21-S6-Scheme-Procedural.php)

- [Thor Page](https://thor.enseirb-matmeca.fr/ruby/projects/projetss6-proc)

# Description

The objective of this project is to implement functionally a collection of image generators and image filters in order to make procedural generation of textures. The code is broken down into two distinct parts:
- A set of image generators
- A set of image filters

# Requirements

- The ```make``` command 
- canvas package
- jest package
- browserify package
- Standard JS libraries

# How to produce an image

Open the image.js file in the src directory. Uncomment a generators or a filters between line 35 and line 884. Write the variable name or the chosen generator / filter as input of the function "generators.generate(...)" line 907. Then go to the root of the project directory and run

```shell
$ make exe
```
to produce the image as canvas.png in the project root directory

else you can run

```shell
$ make gen
```
to produce a page with the image at public/index.html

# Generators

## Noise generators

- Explication: a set of noise generator like Perlin noise or Worley noise 
- Path from root: ```./src/noiseGenerators.js```

## Tiling generators

- Explication: a set of tiling generator like chessBoard or Voronoi patterns
- Path from root: ```./src/tilingGenerators.js```

## Color gradient

- Explication: a set of color gradient
- Path from root: ```./src/colorMapGenerator.js``` or ```./src/colorMapExamples.js```

# Filters

- Explication: a set of filters like a 3d-filter, a zoom filter or even image compositions filters
- Path from root: ```./src/filter.js```

# How to run tests

At the root of the repository, run

```shell
$ make test
```

# How to clean the repository

- Go to the root of the repository

- To clean the repository to its initial state, run

```shell
$ make clean
```

# Authors

- Alexandre Choura
- Léo Guerin
- Lucas Marais
- Jean-François Sornay
