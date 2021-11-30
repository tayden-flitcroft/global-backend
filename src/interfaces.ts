export interface Config {
    pokedex?: {
        uri?: string
    }
}

export interface CountResponse {
    data?: CountDataContent,
    'pokemon_entries'?: [{
        'entry_number'?: number
    }],
}

export interface CountDataContent {
    'pokemon_entries'?: [{
        'entry_number'?: number
    }],
}

export interface ErrorResponse {
    message?: string,
    name?: string,
    config?: {
        url?: string
    },
    url?: string
}

export interface ListBuilderRequest {
    body?: {
        nextUrl?: string
    }
}

export interface PokemonListResponse {
    data?: PokemonDataContent,
    next?: string,
    results?: ResultsContent[]
}

export interface PokemonDataContent {
    next?: string,
    results?: ResultsContent[],
    id?: number,
    name?: string,
    img?: string,
    img_shiny?: string,
    sprites?: {
        back_default?: string,
        back_shiny?: string,
        front_default?: string,
        front_shiny?: string,
        versions?: Versions
        },
    types?: TypesResponse[]
}

export interface TypesResponse {
    slot?: number,
    type?: {
        name?: string,
        url?: string
    }
}

export interface GenerationData {
    icons?: {
        front_default?: string,
        front_female?: string
    },
    'ultra-sun-ultra-moon'?: {
        front_default?: string,
        front_female?: string,
        front_shiny?: string,
        front_shiny_female?: string
    }
}

export interface Versions {
    'generation-vii'?: GenerationData
}

export interface ResultsContent {
    name?: string,
    url?: string
}