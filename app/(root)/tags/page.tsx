'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { SearchParamsProps } from '@/types/props';
import { TagFilters } from '@/constants/filters';
import { tagNoResult } from '@/constants/no-result';
import { getAllTags } from '@/actions/tag.action';
import LocalSearch from '@/components/local-search';
import Filter from '@/components/filter';
import NoResult from '@/components/no-result';
import { tagVariants } from '@/components/tags-badge';
import { cn } from '@/lib/utils';
import Pagination from '@/components/pagination';

interface Tag {
  _id: string;
  name: string;
  Developedby: string;
  description: string;
  questions: { length: number };
}

export default function TagsPage({ searchParams }: SearchParamsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isNext, setIsNext] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const result = await getAllTags({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: Number(searchParams.page) || 1,
      });
      setTags(result.tags);
      setIsNext(result.isNext);
    };
    fetchTags();
  }, [searchParams]);

  return (
    <>
      <h1 className="h1-bold">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search for tags"
          className="flex-1"
        />
        <Filter filters={TagFilters} />
      </div>
      <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              href={`tags/${tag._id}`}
              key={tag._id}
              className="rounded-lg bg-gray-100 dark:bg-dark-200"
            >
              <article className="flex w-full flex-col items-center gap-3 p-5">
                <div>
                  <p
                    className={cn(
                      tagVariants({ size: 'md' }),
                      'background-light700_dark300 font-semibold shadow',
                    )}
                  >
                    {tag.name}
                  </p>
                </div>
                <p className="font-semibold text-gray-500">{tag.Developedby}</p>
                <p className="text-center font-semibold text-gray-500">{tag.description}</p>
                <p className="text-dark400_light500 text-sm">
                  <span className="primary-text-gradient mr-2 font-semibold">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title={tagNoResult.title}
            description={tagNoResult.description}
            buttonText={tagNoResult.buttonText}
            buttonLink={tagNoResult.buttonLink}
          />
        )}
      </section>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
    </>
  );
}
