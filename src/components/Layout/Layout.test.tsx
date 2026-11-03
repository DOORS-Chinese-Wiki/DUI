import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider, Grid, Layout, Space } from '..';

describe('layout primitives', () => {
  it('renders a labelled divider', () => {
    render(<Divider label="Section" />);
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
  });

  it('maps spacing tokens to CSS variables', () => {
    const { container } = render(
      <Space size="lg" direction="vertical">
        <span>One</span>
      </Space>,
    );

    expect(container.firstElementChild).toHaveStyle(
      '--space-gap: var(--doors-space-lg)',
    );
  });

  it('supports responsive and fixed grid definitions', () => {
    const { container, rerender } = render(
      <Grid minItemWidth={180} gap="sm">
        <span>Cell</span>
      </Grid>,
    );

    expect(container.firstElementChild).toHaveStyle(
      '--grid-min: 180px',
    );
    expect(container.firstElementChild).toHaveStyle(
      '--grid-gap: var(--doors-space-sm)',
    );

    rerender(
      <Grid columns={3} responsive={false}>
        <span>Cell</span>
      </Grid>,
    );
    expect(container.firstElementChild).toHaveStyle(
      '--grid-template: repeat(3, minmax(0, 1fr))',
    );
  });

  it('renders Layout as a configurable semantic region', () => {
    render(
      <Layout as="section" aria-label="Preview" maxWidth="prose">
        Content
      </Layout>,
    );
    expect(screen.getByRole('region', { name: 'Preview' })).toBeInTheDocument();
  });
});
