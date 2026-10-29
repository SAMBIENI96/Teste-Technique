<?php

namespace Database\Seeders;

use App\Models\AvailabilitySlot;
use App\Models\Level;
use App\Models\Subject;
use App\Models\Tutor;
use Carbon\CarbonImmutable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $subjects = collect([
                ['Mathématiques', 'maths', 'sigma'],
                ['Français', 'francais', 'book-open'],
                ['Anglais', 'anglais', 'languages'],
                ['Physique-Chimie', 'physique-chimie', 'flask-conical'],
                ['SVT', 'svt', 'leaf'],
                ['Histoire-Géo', 'histoire-geo', 'globe'],
            ])->mapWithKeys(fn ($s) => [$s[1] => Subject::create(['name' => $s[0], 'slug' => $s[1], 'icon' => $s[2]])]);

            $levels = collect([
                ['Primaire', 'primaire', 1],
                ['Collège', 'college', 2],
                ['Lycée', 'lycee', 3],
                ['Supérieur', 'superieur', 4],
            ])->mapWithKeys(fn ($l) => [$l[1] => Level::create(['name' => $l[0], 'slug' => $l[1], 'order' => $l[2]])]);

            // [prénom, années, note, avis, cours, spécialités, [matière => [niveaux]], bio]
            $tutors = [
                ['Aïcha', 8, 4.9, 87, 640, ['exam_prep'], ['maths' => ['college', 'lycee'], 'physique-chimie' => ['lycee']],
                    "Professeure de maths passionnée, j'aide les élèves à reprendre confiance avant le bac."],
                ['Koffi', 3, 4.7, 22, 140, ['catch_up'], ['maths' => ['primaire', 'college']],
                    "Étudiant ingénieur, je rends les maths concrètes avec des exemples du quotidien."],
                ['Mariam', 12, 4.8, 156, 1100, ['exam_prep', 'method'], ['francais' => ['college', 'lycee']],
                    "Agrégée de lettres, spécialiste du bac de français et de la méthodologie de dissertation."],
                ['Thomas', 5, 4.6, 41, 310, ['conversation'], ['anglais' => ['college', 'lycee', 'superieur']],
                    "Bilingue, je privilégie l'oral pour que l'élève ose parler dès la première séance."],
                ['Fatou', 2, 5.0, 3, 25, ['catch_up'], ['svt' => ['college']],
                    "Jeune diplômée en biologie, patiente et à l'écoute des élèves en difficulté."],
                ['Jean-Marc', 15, 4.5, 210, 1800, ['exam_prep'], ['physique-chimie' => ['lycee', 'superieur'], 'maths' => ['lycee']],
                    "Ancien professeur de lycée, je prépare aux concours et aux épreuves scientifiques."],
                ['Nadia', 6, 4.9, 64, 420, ['method', 'catch_up'], ['histoire-geo' => ['college', 'lycee'], 'francais' => ['college']],
                    "J'apprends aux élèves à organiser leurs révisions et à rédiger avec méthode."],
                ['Sèdjro', 4, 4.4, 18, 120, [], ['maths' => ['college'], 'physique-chimie' => ['college']],
                    "Pédagogue et rigoureux, j'accompagne les collégiens tout au long de l'année."],
                ['Claire', 9, 4.8, 95, 700, ['conversation', 'exam_prep'], ['anglais' => ['primaire', 'college']],
                    "Professeure d'anglais pour les plus jeunes, avec jeux et supports visuels."],
                ['Ibrahim', 7, 4.7, 53, 380, ['exam_prep'], ['svt' => ['lycee'], 'physique-chimie' => ['college', 'lycee']],
                    "Doctorant en sciences, je rends les notions complexes simples et visuelles."],
                ['Léa', 1, 4.3, 6, 30, ['catch_up'], ['francais' => ['primaire'], 'maths' => ['primaire']],
                    "Animatrice et étudiante en sciences de l'éducation, idéale pour le primaire."],
                ['Moussa', 10, 4.6, 120, 900, ['method'], ['histoire-geo' => ['lycee', 'superieur']],
                    "Historien de formation, je transforme les cours en récits faciles à retenir."],
            ];

            // Fuseau de l'application (Africa/Casablanca) : 17h = 17h pour le parent
            $start = CarbonImmutable::now()->startOfDay()->addDay();
            $hours = [9, 10, 14, 15, 17, 18, 19];

            foreach ($tutors as $i => [$name, $years, $rating, $reviews, $lessons, $spec, $teach, $bio]) {
                $tutor = Tutor::create([
                    'first_name' => $name,
                    'photo_url' => 'https://i.pravatar.cc/300?img=' . ($i + 5),
                    'bio' => $bio,
                    'years_experience' => $years,
                    'rating' => $rating,
                    'reviews_count' => $reviews,
                    'lessons_count' => $lessons,
                    'specialties' => $spec,
                ]);

                foreach ($teach as $subjectSlug => $levelSlugs) {
                    foreach ($levelSlugs as $levelSlug) {
                        DB::table('tutor_subject_level')->insert([
                            'tutor_id' => $tutor->id,
                            'subject_id' => $subjects[$subjectSlug]->id,
                            'level_id' => $levels[$levelSlug]->id,
                        ]);
                    }
                }

                // Créneaux pseudo-aléatoires mais reproductibles
                mt_srand($i + 1);
                for ($d = 0; $d < 14; $d++) {
                    $day = $start->addDays($d);
                    foreach ($hours as $h) {
                        if (mt_rand(1, 100) <= 18) {
                            AvailabilitySlot::create([
                                'tutor_id' => $tutor->id,
                                'starts_at' => $day->setTime($h, 0),
                                'ends_at' => $day->setTime($h + 1, 0),
                            ]);
                        }
                    }
                }
            }

            mt_srand(); // rétablit un générateur non déterministe pour la suite du processus
        });
    }
}
