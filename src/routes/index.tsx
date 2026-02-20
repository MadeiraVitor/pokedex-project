import { Route, Routes } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Home } from "../pages/Home"
import { PokemonDetail } from "../pages/PokemonDetail"

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/pokemon/:name" element={<PokemonDetail />} />
            </Route>
        </Routes>
    )
}