"use client";

import { updateFormAction } from "@/app/admin/categories/[category]/forms/actions";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/shadcn/ui";
import { AnswerOption, Form, Question } from "@prisma/client";
import { PlusCircle, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ButtonHTMLAttributes,
  MouseEvent,
  useActionState,
  useState,
} from "react";
import { SubmitBtn } from "@/components/submit-btn";
import { cn } from "@/lib/utils";

const initialState: {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
} = {
  message: "",
};
type QuestionProps = Pick<Question, "qText" | "qType" | "id"> & {
  answerOption: Pick<AnswerOption, "title" | "imgUrl" | "id">[];
};
type FormProps = Form & { question: QuestionProps[] };
export const FormEditAction = ({ form }: { form: FormProps }) => {
  const [state, action] = useActionState(updateFormAction, initialState);

  const router = useRouter();
  const [editingForm, setEditingForm] = useState<FormProps>(form);
  const [newQuestion, setNewQuestion] = useState<QuestionProps>({
    qText: "",
    qType: "text",
    id: Date.now().toString(),
    answerOption: [],
  });

  const cancelEditing = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  const updateFormTitle = (title: string) => {
    setEditingForm({
      ...editingForm,
      title,
    });
  };

  const addQuestion = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditingForm({
      ...editingForm,
      question: [...editingForm.question, newQuestion],
    });
    setNewQuestion({
      answerOption: [],
      id: Date.now().toString(),
      qText: "",
      qType: "",
    });
  };

  const removeQuestion = (questionId: string) => {
    setEditingForm({
      ...editingForm,
      question: editingForm.question.filter((q) => q.id !== questionId),
    });
  };

  const updateQuestion = (updatedQuestion: QuestionProps) => {
    setEditingForm({
      ...editingForm,
      question: editingForm.question.map((q, i) =>
        updatedQuestion.id === q.id ? updatedQuestion : q
      ),
    });
  };

  const addOptionToQuestion = (questionId: string) => {
    setEditingForm({
      ...editingForm,
      question: editingForm.question.map((q) =>
        q.id === questionId && q.answerOption && q.answerOption.length < 5
          ? {
              ...q,
              answerOption: [
                ...q.answerOption,
                {
                  title: "",
                  imgUrl: "",
                  id: Date.now().toString(),
                },
              ],
            }
          : q
      ),
    });
  };

  const deleteOptionFromQuestion = (questionId: string, optionId: string) => {
    setEditingForm({
      ...editingForm,
      question: editingForm.question.map((q) =>
        q.id === questionId && q.answerOption
          ? {
              ...q,
              answerOption: q.answerOption.filter((opt) => opt.id !== optionId),
            }
          : q
      ),
    });
  };

  const addOption = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newQuestion.answerOption && newQuestion.answerOption.length < 5) {
      setNewQuestion({
        ...newQuestion,
        answerOption: [
          ...newQuestion.answerOption,
          {
            title: "",
            imgUrl: "",
            id: Date.now().toString(),
          },
        ],
      });
    }
  };

  const updateOption = (optionId: string, title: string) => {
    if (newQuestion.answerOption) {
      setNewQuestion({
        ...newQuestion,
        answerOption: newQuestion.answerOption.map((opt) =>
          opt.id === optionId ? { ...opt, title } : opt
        ),
      });
    }
  };

  const renderQuestionInput = (question: QuestionProps) => {
    switch (question.qType) {
      case "text":
        return (
          <Input type="text" placeholder="Réponse par courte phrase" disabled />
        );
      case "long-text":
        return <Textarea placeholder="Réponse par long texte" disabled />;
      case "number":
        return (
          <Input type="number" placeholder="Réponse par nombre" disabled />
        );
      case "single-choice":
        return (
          <RadioGroup>
            {question.answerOption?.map((option, index) => (
              <div
                key={`renderQuestionInput-single-choice-${
                  index + "-" + option.id
                }`}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={option.title}
                  id={`option-${question.qText}-${index}`}
                  disabled
                />
                <Label htmlFor={`option-${question.qText}-${index}`}>
                  {option.title || `Option ${index + 1}`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "multiple-choice":
        return (
          <div className="space-y-2">
            {question.answerOption?.map((option, index) => (
              <div
                key={`renderQuestionInput-multiple-choice-${
                  index + "-" + option.id
                }`}
                className="flex items-center space-x-2"
              >
                <Checkbox id={`option-${question.qText}-${index}`} disabled />
                <Label htmlFor={`option-${question.qText}-${index}`}>
                  {option.title || `Option ${index + 1}`}
                </Label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      variant={"ghost"}
      className="w-full max-w-xl overflow-y-auto relative"
    >
      <form
        action={async () => {
          const formData = new FormData();
          formData.set("editingForm", JSON.stringify(editingForm));
          await action(formData);
        }}
      >
        <CardHeader>
          <CardTitle>
            <Input
              name="title"
              value={editingForm.title}
              onChange={(e) => updateFormTitle(e.target.value)}
              className="text-2xl font-bold"
              required
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {editingForm.question.map((question, qIndex) => (
            <div
              key={`question-${qIndex + "-" + question.id}`}
              className="border p-4 rounded-md space-y-2"
            >
              <div>
                <div className="flex justify-between items-center">
                  <Input
                    value={question.qText}
                    onChange={(e) =>
                      updateQuestion({ ...question, qText: e.target.value })
                    }
                    autoFocus={
                      !!state.fieldErrors &&
                      !!state.fieldErrors[`question,${qIndex},qText`]
                    }
                    className={cn(
                      !!state.fieldErrors &&
                        !!state.fieldErrors[`question,${qIndex},qText`] &&
                        "ring-1 ring-red-500",
                      "text-lg font-semibold"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      removeQuestion(question.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {!!state.fieldErrors &&
                  !!state.fieldErrors[`question,${qIndex},qText`] && (
                    <p className="text-sm text-red-500">
                      * {state.fieldErrors[`question,${qIndex},qText`]}
                    </p>
                  )}
              </div>
              <div>
                <Select
                  value={question.qType}
                  onValueChange={(value: string /* question type */) =>
                    updateQuestion({
                      ...question,
                      qType: value,
                      answerOption:
                        value === "single-choice" || value === "multiple-choice"
                          ? question.answerOption || []
                          : [],
                    })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      !!state.fieldErrors &&
                        !!state.fieldErrors[`question,${qIndex},qType`] &&
                        "ring-1 ring-red-500"
                    )}
                  >
                    <SelectValue placeholder="Choisis le type de la question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="long-text">Long Texte</SelectItem>
                    <SelectItem value="number">Nombre</SelectItem>
                    <SelectItem value="single-choice">Choix unique</SelectItem>
                    <SelectItem value="multiple-choice">
                      Choix multiple
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!!state.fieldErrors &&
                  !!state.fieldErrors[`question,${qIndex},qType`] && (
                    <p className="text-sm text-red-500">
                      * {state.fieldErrors[`question,${qIndex},qType`]}
                    </p>
                  )}
              </div>
              {(question.qType === "single-choice" ||
                question.qType === "multiple-choice") && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {question.answerOption?.map((option, index) => (
                    <div
                      key={`question-${question.id}-answerOption-${
                        index + "-" + option.id
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Input
                          className={cn(
                            !!state.fieldErrors &&
                              !!state.fieldErrors[`question,${qIndex},qText`] &&
                              "ring-1 ring-red-500"
                          )}
                          value={option.title}
                          onChange={(e) =>
                            updateQuestion({
                              ...question,
                              answerOption: question.answerOption?.map(
                                (opt, i) =>
                                  i === index
                                    ? { ...opt, title: e.target.value }
                                    : { ...opt, title: opt.title }
                              ),
                            })
                          }
                          placeholder={`Option ${index + 1}`}
                          autoFocus={
                            !!state.fieldErrors &&
                            !!state.fieldErrors[
                              `question,${qIndex},answerOption,${index},title`
                            ]
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteOptionFromQuestion(question.id, option.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {!!state.fieldErrors &&
                        !!state.fieldErrors[
                          `question,${qIndex},answerOption,${index},title`
                        ] && (
                          <p className="text-sm text-red-500">
                            *{" "}
                            {
                              state.fieldErrors[
                                `question,${qIndex},answerOption,${index},title`
                              ]
                            }
                          </p>
                        )}
                    </div>
                  ))}
                  {question.answerOption &&
                    question.answerOption.length < 5 && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          addOptionToQuestion(question.id);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Ajouter une option
                      </Button>
                    )}
                </div>
              )}
              {renderQuestionInput(question)}
            </div>
          ))}

          {/* Add New Question */}
          <div className="border p-4 rounded-md space-y-4">
            <h3 className="text-xl font-semibold">
              Ajouter une nouvelle question
            </h3>
            <div className="space-y-2">
              <Label htmlFor="question-title">Titre de la question</Label>
              <Input
                id="question-title"
                value={newQuestion.qText}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, qText: e.target.value })
                }
                placeholder="Entrer la question"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-type">Type de la question</Label>
              <Select
                value={newQuestion.qType}
                onValueChange={(value: string /*QuestionType*/) =>
                  setNewQuestion({
                    ...newQuestion,
                    qType: value,
                    answerOption:
                      value === "single-choice" || value === "multiple-choice"
                        ? [
                            {
                              id: Date.now().toString(),
                              imgUrl: "",
                              title: "",
                            },
                          ]
                        : [],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisis le type de la question" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="long-text">Long Texte</SelectItem>
                  <SelectItem value="number">Nombre</SelectItem>
                  <SelectItem value="single-choice">Choix unique</SelectItem>
                  <SelectItem value="multiple-choice">
                    Choix multiple
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(newQuestion.qType === "single-choice" ||
              newQuestion.qType === "multiple-choice") && (
              <div className="space-y-2">
                <Label>Options</Label>
                {newQuestion.answerOption?.map((option, index) => (
                  <Input
                    key={`newQuestion-option-${option.id + "-" + index}`}
                    value={option.title}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                {newQuestion.answerOption &&
                  newQuestion.answerOption.length < 5 && (
                    <Button
                      onClick={addOption}
                      variant="outline"
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Ajouter une option
                    </Button>
                  )}
              </div>
            )}
            <Button onClick={addQuestion} className="w-full">
              Ajouter la question
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-end">
          <div className="flex justify-end space-x-2">
            <Button onClick={cancelEditing} variant="outline">
              Annuler
            </Button>
            <SubmitBtn className="flex gap-1 items-center justify-center">
              <Save className="size-4" /> Sauvegarder le formulaire
            </SubmitBtn>
          </div>
          {!!state.message && (
            <p className="text-sm text-red-500">* {state.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};
