import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockFetch from "./mocks/mockFetch";
import App from "./App";
// ! to Check that the dogs we search are correct
beforeEach(() => {
    jest.spyOn(window, "fetch").mockImplementation(mockFetch);
});

afterEach(() => {
    jest.restoreAllMocks();
});
test("renders the landing page", async () => {
    render(<App />);

    expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Catalogue/); //todo : check the heading has the same name
    expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed"); //todo : check the combobox has the same name
    expect(await screen.findByRole("option", { name: "husky" })).toBeInTheDocument(); //! : to fix act error
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled(); //todo : check the cheading has the same name
    expect(screen.getByRole("img")).toBeInTheDocument(); //todo : check the cheading has the same name
});

test("should be able to search and display dog image results", async () => {
    render(<App />);

    //Simulate selecting an option and verifying its value
    const select = screen.getByRole("combobox");
    expect(await screen.findByRole("option", { name: "cattledog" })).toBeInTheDocument();
    userEvent.selectOptions(select, "cattledog");
    expect(select).toHaveValue("cattledog");

    //Initiate the search request
    const searchBtn = screen.getByRole("button", { name: "Search" });
    expect(searchBtn).not.toBeDisabled();
    userEvent.click(searchBtn);

    //Loading state displays and gets removed once results are displayed
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    //Verify image display and results count
    const dogImages = screen.getAllByRole("img");
    expect(dogImages).toHaveLength(2);
    expect(screen.getByText(/2 Results/i)).toBeInTheDocument();
    expect(dogImages[0]).toHaveAccessibleName("cattledog 1 of 2");
    expect(dogImages[1]).toHaveAccessibleName("cattledog 2 of 2");
});
