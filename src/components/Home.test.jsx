import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';

// Mock the storage functions
vi.mock('../utils/storage', () => ({
  getWeeklyCheckIns: () => [],
  getStreak: () => 0,
  getAverageStress: () => 0,
  saveMoodCheckIn: vi.fn(),
  STORAGE_KEYS: { LAST_CHECK_IN: 'last_check_in' }
}));

// Mock fetch for ThoughtOfTheWeek component
global.fetch = vi.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve(Array(168).fill({ quote: "Test quote", by: "Test Author" }))
  })
);

describe('Home Component', () => {
  it('renders without crashing and displays greetings', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for async fetch to complete to prevent "act" warnings
    await waitFor(() => {
      expect(screen.getByText('Daily Check-In')).toBeInTheDocument();
    });
    
    // Should have quick actions
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });
});
