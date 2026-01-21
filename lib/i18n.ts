import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: "Login",
      register: "Register",
      guest: "Continue as Guest",
      logout: "Logout",
      landing: {
        title_prefix: "Manage tasks with",
        title_highlight: "Task Pro",
        subtitle: "The ultimate task management solution for individuals and teams. Stay organized, focused, and productive.",
        get_started: "Get Started",
        dashboard: "Dashboard",
        learn_more: "Learn more"
      },
      nav: {
        dashboard: "Dashboard",
        tasks: "Tasks",
        board: "Board",
        analytics: "Analytics",
        profile: "Profile",
        logout: "Logout"
      },
      auth: {
        login_subtitle: "Sign in to your account to continue",
        register_subtitle: "Create your account to get started",
        already_have_account: "Already have an account?",
        no_account: "Don't have an account?",
        go_back: "Go Back"
      },
      tasks: {
        add_task: "Add Task",
        new_task: "New Task",
        edit: "Edit",
        delete: "Delete",
        delete_confirm: "Are you sure you want to delete this task?",
        mark_complete: "Mark Complete",
        mark_incomplete: "Mark Incomplete",
        cancel: "Cancel",
        create_task: "Create Task",
        no_tasks: "No tasks found. Create one to get started!",
        form: {
          title: "Title",
          description: "Description",
          priority: "Priority"
        },
        status: {
          todo: "To Do",
          in_progress: "In Progress",
          done: "Done"
        }
      },
      analytics: {
        title: "Analytics",
        subtitle: "Track your productivity and progress",
        total_tasks: "Total Tasks",
        in_progress: "In Progress",
        completed: "Completed",
        status_distribution: "Status Distribution",
        priority_distribution: "Priority Distribution",
        completion_rate: "Completion Rate",
        overall_progress: "Overall progress",
        overall_progress_details: "Detailed view of your task progress",
        filter_all: "All",
        filter_todo: "To do",
        filter_in_progress: "In progress",
        filter_done: "Done",
        no_tasks_for_filter: "No tasks for this filter yet",
        recent_activity: "Recent activity"
      },
      dashboard: {
        welcome_back: "Welcome back, {{name}}",
        subtitle: "Overview of your tasks and key productivity stats.",
        total_tasks: "Total tasks",
        in_progress: "Tasks in progress",
        completed: "Completed tasks",
        recent_tasks: "Recent tasks",
        no_tasks: "No tasks yet"
      },
      profile: {
        title: "Profile",
        subtitle: "Manage your account settings",
        user_info: "User Information",
        email: "Email",
        created: "Created",
        account_type: "Account Type",
        status: "Status",
        preferences: "Preferences",
        theme: "Theme",
        theme_desc: "Choose your theme",
        language: "Language",
        language_desc: "Select language",
        danger_zone: "Danger Zone",
        logout_desc: "Sign out of your account",
        guest_account: "Guest Account",
        registered_account: "Registered Account"
      }
    }
  },
  uk: {
    translation: {
      login: "Вхід",
      register: "Реєстрація",
      logout: "Вийти",
      landing: {
        title_prefix: "Керуйте завданнями з",
        title_highlight: "Task Pro",
        subtitle: "Найкраще рішення для керування завданнями для окремих користувачів та команд. Будьте організованими та продуктивними.",
        get_started: "Розпочати",
        dashboard: "Дашборд",
        learn_more: "Дізнатися більше"
      },
      nav: {
        dashboard: "Дашборд",
        tasks: "Завдання",
        analytics: "Аналітика",
        profile: "Профіль",
        logout: "Вийти"
      },
      auth: {
        login_subtitle: "Увійдіть у свій обліковий запис",
        register_subtitle: "Створіть обліковий запис",
        already_have_account: "Вже маєте обліковий запис?",
        no_account: "Немає облікового запису?",
        go_back: "Назад"
      },
      tasks: {
        add_task: "Додати завдання",
        new_task: "Нове завдання",
        edit: "Редагувати",
        delete: "Видалити",
        delete_confirm: "Ви впевнені, що хочете видалити це завдання?",
        mark_complete: "Позначити виконаним",
        mark_incomplete: "Позначити невиконаним",
        cancel: "Скасувати",
        create_task: "Створити завдання",
        no_tasks: "Завдань не знайдено. Створіть нове!",
        form: {
          title: "Назва",
          description: "Опис",
          priority: "Пріоритет"
        },
        status: {
          todo: "До виконання",
          in_progress: "В процесі",
          done: "Виконано"
        }
      },
      board: {
        title: "Дошка завдань",
        subtitle: "Перетягуйте завдання для зміни статусу",
        no_tasks: "Поки немає завдань",
        drag_here: "Перетягніть завдання сюди"
      },
      analytics: {
        title: "Аналітика",
        subtitle: "Відстежуйте свою продуктивність",
        total_tasks: "Всього завдань",
        in_progress: "В процесі",
        completed: "Завершено",
        status_distribution: "Розподіл за статусом",
        priority_distribution: "Розподіл за пріоритетом",
        completion_rate: "Рівень завершення",
        overall_progress: "Загальний прогрес",
        overall_progress_details: "Детальний огляд прогресу виконання завдань",
        filter_all: "Усі",
        filter_todo: "До виконання",
        filter_in_progress: "В процесі",
        filter_done: "Виконані",
        no_tasks_for_filter: "Немає завдань для цього фільтра",
        recent_activity: "Останні дії"
      },
      dashboard: {
        welcome_back: "Вітаємо, {{name}}!",
        subtitle: "Огляд ваших завдань і основних показників продуктивності.",
        total_tasks: "Загальна кількість завдань",
        in_progress: "Завдання в процесі",
        completed: "Виконані завдання",
        recent_tasks: "Останні завдання",
        no_tasks: "Немає завдань"
      },
      profile: {
        title: "Профіль",
        subtitle: "Керуйте налаштуваннями облікового запису",
        user_info: "Інформація користувача",
        email: "Електронна пошта",
        created: "Створено",
        account_type: "Тип облікового запису",
        status: "Статус",
        preferences: "Налаштування",
        theme: "Тема",
        theme_desc: "Виберіть тему",
        language: "Мова",
        language_desc: "Оберіть мову",
        danger_zone: "Небезпечна зона",
        logout_desc: "Вийти з облікового запису",
        guest_account: "Гостьовий обліковий запис",
        registered_account: "Зареєстрований обліковий запис"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
