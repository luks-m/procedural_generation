# Projet Génération Procédurale

- [Project Subject Page](https://www.labri.fr/perso/renault/working/teaching/projets/2020-21-S6-Scheme-Procedural.php)

- [Thor Page](https://thor.enseirb-matmeca.fr/ruby/projects/projetss6-proc)

# Description

The objective of the project is to implement functionally a collection of image generators and image filters in order to make procedural generation of textures. The code is broken down into two distinct parts:
- A set of image generators
- A set of image filters

# Requirements

- The ```make``` command 
- canvas package
- jest package
- Standard JS libraries

# How to produce an image

Open the image.js file in the src directory. Uncomment a generators or a filters between line 35 and line 884. Write the variable name og the generator /filter choiced as input of the function "generators.generate(...)" line 907. Then go to the root of the project directory and run

```shell
$ make exe
```
to produce an the image as canvas.png on the project root

else you can run

```shell
$ make gen
```
to produce an page at public/index.html

# Generators

## Noise generators

- Explication: a set of noise generator like Perlin noise, Worley noise 
- Path from root: ```./src/noiseGenerators.js```

## Tiling generators

- Explication: a set of tiling gnerator like chessBoard or Voronoi patterns
- Path from root: ```./src/tilingGenerators.js```

## Color gradient

- Explication: a set of color gradient
- Path from root: ```./src/colorMapGenerator.js``` or ```./src/colorMapExamples.js```

# Filters

- Explication: a set of filters like a 3d-filter, a zoom filter or image compositions
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
