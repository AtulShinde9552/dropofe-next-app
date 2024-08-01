'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants/navigation';
import { SignedOut, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserCircle, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getQuestionCount } from '@/actions/question.action';
import { getUserCount } from '@/actions/user.action';
import { getTagCount } from '@/actions/tag.action';

export default function LeftSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [questionsCount, setQuestionsCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [tagsCount, setTagsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [questionCount, userCount, tagCount] = await Promise.all([
          getQuestionCount(),
          getUserCount(),
          getTagCount(),
        ]);
        setQuestionsCount(questionCount);
        setUsersCount(userCount);
        setTagsCount(tagCount);
      } catch (err) {
        console.error('Failed to fetch counts', err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <aside className="background-light900_dark200 light-border sticky left-0 top-20 flex h-[calc(100vh-5rem)] flex-col border-r p-5 shadow dark:shadow-none max-sm:hidden lg:w-[250px]">
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col gap-1">
          {sidebarLinks.map((item) => {
            const isActive =
              (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
            if (item.route === '/profile') {
              if (user?.username) {
                item.route = `/profile/${user.username}`;
              } else {
                return null;
              }
            }
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`flex items-center gap-3 rounded-md p-4 text-sm ${
                  isActive ? 'primary-gradient' : ''
                }`}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? '' : 'invert-colors'}`}
                />
                <span className={`${isActive ? 'font-bold' : 'font-medium'} max-lg:hidden`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="text-white-100 dark:text-white-200 bg-white-200 mt-4 rounded-md p-4 dark:bg-gray-900">
          <ul>
            <li>Total Questions: {questionsCount ?? '??'}</li>
            <li>Total Users: {usersCount ?? '??'}</li>
            <li>All Engineering Software: {tagsCount ?? '??'}</li>
          </ul>
        </div>
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link
              href="/sign-in"
              className={cn(buttonVariants(), 'btn-secondary small-medium w-full text-orange-500')}
            >
              <UserCircle className="h-5 w-5 lg:hidden" />
              <span className="max-lg:hidden">Login</span>
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants(), 'btn-tertiary text-dark400_light900 w-full')}
            >
              <UserPlus className="h-5 w-5 lg:hidden" />
              <span className="max-lg:hidden">Sign up</span>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
}
