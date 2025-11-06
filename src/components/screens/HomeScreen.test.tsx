import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomeScreen } from './HomeScreen';
import * as api from '../../utils/api';

// Mock the api module
vi.mock('../../utils/api', () => ({
  fetchBooks: vi.fn(),
}));

// Mock the AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ currentUser: { displayName: 'Test User' } }),
}));

describe('HomeScreen', () => {
  it('should render the home screen and display books', async () => {
    const mockBooks = [
      { id: '1', title: 'Test Book 1', author: 'Author 1', image: '', rating: 4.5, trending: 1, readers: 100 },
      { id: '2', title: 'Test Book 2', author: 'Author 2', image: '', rating: 4.2, trending: 2, readers: 200 },
    ];

    (api.fetchBooks as any).mockResolvedValue(mockBooks);

    render(<HomeScreen onSelectBook={() => {}} onUpgrade={() => {}} />);

    // Check for the main heading
    expect(screen.getByText('Lanjutkan Membaca')).toBeInTheDocument();

    // Check if the books are rendered
    await waitFor(() => {
      expect(screen.getAllByText('Test Book 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Test Book 2').length).toBeGreaterThan(0);
    });
  });
});
