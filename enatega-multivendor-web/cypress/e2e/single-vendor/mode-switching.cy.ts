describe("single-vendor mode", () => {
  it("defaults to Multi Vendor and persists an explicit switch", () => {
    cy.visit("/discovery", { onBeforeLoad: (window) => window.localStorage.clear() });
    cy.window().then((window) => {
      expect(window.localStorage.getItem("@enatega/app-mode")).not.to.eq("SINGLE");
    });
    cy.contains("button", "Single Vendor").first().click();
    cy.window().its("localStorage").invoke("getItem", "@enatega/app-mode").should("eq", "SINGLE");
  });

  it("keeps mode-specific tokens isolated", () => {
    cy.visit("/", { onBeforeLoad(window) {
      window.localStorage.setItem("@enatega/multi/token", "multi-token");
      window.localStorage.setItem("@enatega/single/token", "single-token");
    } });
    cy.window().then((window) => {
      expect(window.localStorage.getItem("@enatega/multi/token")).to.eq("multi-token");
      expect(window.localStorage.getItem("@enatega/single/token")).to.eq("single-token");
    });
  });
});
