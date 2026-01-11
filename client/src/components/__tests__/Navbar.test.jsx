import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mocks for Contexts
const mockAddToCart = vi.fn();
const mockToggleLanguage = vi.fn();

vi.mock('../../context/CartContext', () => ({
    useCart: () => ({
        cart: [1, 2, 3], // Mocking 3 items in cart
        addToCart: mockAddToCart
    })
}));

vi.mock('../../context/LanguageContext', () => ({
    useLanguage: () => ({
        language: 'da',
        toggleLanguage: mockToggleLanguage,
        t: (key) => {
            const translations = {
                'nav.home': 'Forside',
                'nav.repairs': 'Reparationer',
                'nav.business': 'Erhverv',
                'nav.about': 'Om os',
                'nav.contact': 'Kontakt',
                'nav.bookNow': 'Bestil Tid',
                'nav.login': 'Log ind'
            };
            return translations[key] || key;
        }
    })
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: null // Default to logged out
    })
}));

// Mock Logo to avoid canvas/image issues in jsdom if any
vi.mock('../Logo', () => ({
    default: () => <div data-testid="logo">Logo</div>
}));

describe('Navbar Component', () => {
    const renderNavbar = () => {
        return render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
    };

    it('renders all navigation links', () => {
        renderNavbar();

        // Links appear twice (Desktop + Mobile)
        expect(screen.getAllByText('Forside').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Reparationer').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Erhverv').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Om os').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Kontakt').length).toBeGreaterThan(0);
    });

    it('displays the correct cart count', () => {
        renderNavbar();
        // We mocked cart with 3 items. 
        // The badge appears in both desktop and mobile views.
        const badges = screen.getAllByText('3');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('renders the Book Now button', () => {
        renderNavbar();
        const button = screen.getAllByText('Bestil Tid')[0]; // Mobile and Desktop?
        expect(button).toBeInTheDocument();
        expect(button.closest('a')).toHaveAttribute('href', '/reparationer');
    });

    it('toggles mobile menu when hamburger is clicked', async () => {
        renderNavbar();

        // Simulate Mobile Viewport logic (Navbar checks media queries in CSS, but the button rendering is based on .mobile-only class)
        // In JSDOM, we rely on the button being present in the DOM. 
        // Although visible via CSS, it's always in the DOM structure in the current implementation.

        // Find the hamburger button (it has the Menu icon)
        // Since we use lucide-react, the Menu icon SVG is rendered. 
        // We can find the button by its functionality or structure.
        // The button toggles state.

        // Note: The Navbar renders both Desktop and Mobile controls in the DOM, hidden by CSS.
        // JSDOM doesn't hide elements based on CSS classes unless we check styling explicitly.
        // So 'screen.getByRole' might find duplicates or hidden ones.

        // Let's find the toggle button. It renders <Menu /> when closed.
        // Since it's an SVG, let's look for the button wrapper.
        // We can assume it's the button that is not language or theme or user toggle.
        // Or we can add a data-testid in the source, but let's try to target it via a robust selector if possible.
        // Actually, looking at the code: <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} ...>

        // Let's find closely:
        const buttons = screen.getAllByRole('button');
        // The mobile menu button contains the Menu icon.
        // Typically SVGs don't have text.

        // Let's rely on the fact that when we click the menu button, the overlay gets the 'open' class.

        // Select the wrapper that becomes .open
        const overlay = screen.getByText('Forside', { selector: '.mobile-menu-overlay .mobile-nav-link' }).closest('.mobile-menu-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).not.toHaveClass('open');

        // Find the mobile toggle button. It's inside .mobile-only
        // Using a query selector for precision
        const toggleButton = document.querySelector('.mobile-only button');

        fireEvent.click(toggleButton);

        expect(overlay).toHaveClass('open');

        // Click again to close
        fireEvent.click(toggleButton);
        expect(overlay).not.toHaveClass('open');
    });
});
