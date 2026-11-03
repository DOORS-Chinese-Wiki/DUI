import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SearchField } from '.';

describe('SearchField', () => {
  it('forwards its ref to the native search input and supports controlled editing', async () => {
    const ref = createRef<HTMLInputElement>();
    function Example() {
      const [query, setQuery] = useState('');
      return <SearchField ref={ref} aria-label="搜索组件" value={query}
        onChange={event => setQuery(event.target.value)} />;
    }
    render(<Example />);
    const search = screen.getByRole('searchbox', { name: '搜索组件' });
    expect(ref.current).toBe(search);
    await userEvent.click(screen.getByText('/'));
    expect(search).toHaveFocus();
    await userEvent.type(search, 'Button');
    expect(search).toHaveValue('Button');
    await userEvent.clear(search);
    expect(search).toHaveValue('');
  });

  it('keeps a disabled input uneditable', async () => {
    render(<SearchField aria-label="搜索组件" disabled defaultValue="Slider" />);
    const search = screen.getByRole('searchbox', { name: '搜索组件' });
    expect(search).toBeDisabled();
    await userEvent.type(search, 'Button');
    expect(search).toHaveValue('Slider');
  });
});
