import { TopicCard } from '../TopicCard';

export default function TopicCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <TopicCard
        id="example-1"
        title="Advanced Programming Concepts"
        description="Deep dive into OOP, design patterns, and best practices for software development"
        module="BIT 302"
        tutorName="Sarah Johnson"
        subscriberCount={45}
        isSubscribed={false}
        onSubscribe={() => console.log('Subscribe clicked')}
      />
    </div>
  );
}
