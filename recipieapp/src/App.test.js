import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GlobalState from "./context";
import App from "./App";

test("renders the app navbar", () => {
  render(
    <MemoryRouter>
      <GlobalState>
        <App />
      </GlobalState>
    </MemoryRouter>
  );
  expect(screen.getByText(/FoodRecipe/i)).toBeInTheDocument();
});
