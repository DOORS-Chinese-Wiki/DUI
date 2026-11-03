import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from '.';

describe('Text', () => {
  it('renders the requested semantic element', () => {
    render(
      <Text as="h1" variant="display">
        Archive
      </Text>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Archive' }),
    ).toBeInTheDocument();
  });

  it('renders code with the code variant', () => {
    render(<Text as="code" variant="code">{'<Button />'}</Text>);
    expect(screen.getByText('<Button />')).toBeInTheDocument();
  });
});
