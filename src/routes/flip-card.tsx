import { FlipCard } from '@/components/FlipCard';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/flip-card')({
  component: Page
});

function Page() {
  const [controlled, setControlled] = useState(false);

  return (
    <div className='w-screen min-h-screen flex flex-col items-center justify-center gap-12 bg-black p-8'>
      {/* Example 1: Hover to flip (default) */}
      <section className='flex flex-col items-center gap-4'>
        <h2 className='text-white text-xl font-semibold'>Hover to Flip</h2>
        <FlipCard.Root>
          <FlipCard.Front>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              🎯 Hover Me
            </div>
          </FlipCard.Front>
          <FlipCard.Back>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              ✨ Back Side
            </div>
          </FlipCard.Back>
        </FlipCard.Root>
      </section>

      {/* Example 2: Click to flip */}
      <section className='flex flex-col items-center gap-4'>
        <h2 className='text-white text-xl font-semibold'>Click to Flip</h2>
        <FlipCard.Root flipOnHover={false} flipOnClick className='cursor-pointer'>
          <FlipCard.Front>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              👆 Click Me
            </div>
          </FlipCard.Front>
          <FlipCard.Back>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              🎉 Clicked!
            </div>
          </FlipCard.Back>
        </FlipCard.Root>
      </section>

      {/* Example 3: With Trigger Button */}
      <section className='flex flex-col items-center gap-4'>
        <h2 className='text-white text-xl font-semibold'>With Trigger Button</h2>
        <FlipCard.Root flipOnHover={false}>
          <FlipCard.Front className='flex flex-col items-center justify-center gap-4'>
            <span className='text-white text-xl font-bold'>Front Side</span>
            <FlipCard.Trigger asChild>
              <Button variant='secondary' size='sm'>
                Flip to Back →
              </Button>
            </FlipCard.Trigger>
          </FlipCard.Front>
          <FlipCard.Back className='flex flex-col items-center justify-center gap-4'>
            <span className='text-white text-xl font-bold'>Back Side</span>
            <FlipCard.Trigger asChild>
              <Button variant='secondary' size='sm'>
                ← Flip to Front
              </Button>
            </FlipCard.Trigger>
          </FlipCard.Back>
        </FlipCard.Root>
      </section>

      {/* Example 4: Controlled Mode */}
      <section className='flex flex-col items-center gap-4'>
        <h2 className='text-white text-xl font-semibold'>Controlled Mode</h2>
        <FlipCard.Root
          isFlipped={controlled}
          onFlipChange={setControlled}
          flipOnHover={false}
          animation={{ duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <FlipCard.Front className='bg-linear-to-br from-purple-500 to-pink-500'>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              💜 Front
            </div>
          </FlipCard.Front>
          <FlipCard.Back className='bg-linear-to-br from-cyan-500 to-blue-500'>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              💙 Back
            </div>
          </FlipCard.Back>
        </FlipCard.Root>
        <Button onClick={() => setControlled(prev => !prev)} variant='outline'>
          External Toggle: {controlled ? 'Unflip' : 'Flip'}
        </Button>
      </section>

      {/* Example 5: Vertical Flip */}
      <section className='flex flex-col items-center gap-4'>
        <h2 className='text-white text-xl font-semibold'>Vertical Flip Direction</h2>
        <FlipCard.Root direction='vertical'>
          <FlipCard.Front className='bg-linear-to-b from-green-400 to-green-600'>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              ⬆️ Hover Me
            </div>
          </FlipCard.Front>
          <FlipCard.Back className='bg-linear-to-b from-orange-400 to-orange-600'>
            <div className='w-full h-full flex items-center justify-center text-white text-2xl font-bold'>
              ⬇️ Vertical!
            </div>
          </FlipCard.Back>
        </FlipCard.Root>
      </section>
    </div>
  );
}
