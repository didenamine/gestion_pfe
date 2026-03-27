import { useEffect, useState } from "react";
import type { UserStory } from "@/types";
import { Button } from "@/components/ui/button";

import {
  createUserStory,
  deleteUserStory,
  getUserStories,
  updateUserStory,
} from "@/services/user-stories";
import { UserStoryDialog } from "./user-story-dialog";
import { UserStoryItem } from "./user-story-item";
import { useToast } from "@/context/toast-context";

interface UserstoryForm {
  title: string;
  description: string;
  priority: UserStory["priority"];
  sprintId: string;
}

export default function StudentUserStories() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStory, setCurrentStory] = useState<UserStory | null>(null);

  const [form, setForm] = useState<UserstoryForm>({
    title: "",
    description: "",
    priority: "medium",
    sprintId: "",
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { showToast } = useToast();

  // Fetch user stories
  useEffect(() => {
    (async () => {
      const data = await getUserStories();
      setUserStories(data);
    })();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", priority: "medium", sprintId: "" });
    setStartDate(null);
    setEndDate(null);
    setCurrentStory(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentStory) {
        await updateUserStory(currentStory.id, {
          ...form,
          startDate,
          endDate,
        });
      } else {
        await createUserStory({
          ...form,
          startDate,
          endDate,
        });
      }

      // Refresh list
      const data = await getUserStories();
      setUserStories(data);
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to save user story",
      });
    }
  };

  const handleEdit = (story: UserStory) => {
    setCurrentStory(story);
    setForm({
      title: story.title,
      description: story.description,
      priority: story.priority,
      sprintId: story.sprintId,
    });
    setStartDate(new Date(story.startDate));
    setEndDate(new Date(story.endDate));
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (userStoryId: string) => {
    try {
      await deleteUserStory(userStoryId);
      setUserStories((prev) => prev.filter((s) => s.id !== userStoryId));
      resetForm();
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to delete user story",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">User Stories</h2>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          New User Story
        </Button>
      </div>

      <UserStoryDialog
        open={open}
        setOpen={setOpen}
        isEditing={isEditing}
        form={form}
        setForm={setForm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        resetForm={resetForm}
      />
      <div className="space-y-3">
        {userStories.map((story) => (
          <UserStoryItem
            key={story.id}
            userStory={story}
            handleEdit={() => handleEdit(story)}
            handleDelete={() => handleDelete(story.id)}
          />
        ))}
      </div>
    </div>
  );
}
