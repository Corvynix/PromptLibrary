import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Landing from "@/pages/Landing";

// Mock wouter Link to avoid MemoryRouter issues
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function renderLanding() {
  return render(
    <QueryClientProvider client={queryClient}>
      <Landing />
    </QueryClientProvider>
  );
}

describe("Landing page", () => {
  it("renders hero headline", () => {
    renderLanding();
    expect(document.body.textContent).toContain("THE MBA");
  });

  it("renders stats strip", () => {
    renderLanding();
    // We search for a known stat label from landingData if possible, 
    // or a generic part of the stats section
    expect(document.querySelector("#stats")).not.toBeNull();

  });

  it("renders all 8 section anchors", () => {
    renderLanding();
    expect(document.querySelector("#stats")).not.toBeNull();

    expect(document.querySelector("#program")).toBeInTheDocument();
    expect(document.querySelector("#outcomes")).toBeInTheDocument();
    expect(document.querySelector("#curriculum")).toBeInTheDocument();
    expect(document.querySelector("#faculty")).toBeInTheDocument();
    expect(document.querySelector("#testimonials")).toBeInTheDocument();
    expect(document.querySelector("#faq")).toBeInTheDocument();
    expect(document.querySelector("#apply")).toBeInTheDocument();
  });
});
