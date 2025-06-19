# DB-Benchmark
PostgreSQL and MongoDB benchmark, made for a university project.

Nicolaus Copernicus University in Toruń,
Aleks Zieliński & Filip Kalinowski.
May/June 2025.

# Respository
- [json folder](./json) containt json files on which the tests were done (json files are in English).
- [csv folder](./csv) contains data form the benchmark tests.
- [sql_nosql folder](./sql_nosql) contains queries that were used for the tests.
- [latex folder](./latex) contains a .tex file and compiled pdf file from it.
- [db_schema folder](./db_schema) contains a logical model of our database.
- [tutorial folder](./tutorial) contains an installation process of PostgreSQL and MongoDB.

# Our project (in Polish)
1. Zaprojektować schemat dokumentów JSON dla wybranego tematu. Należy mieć min 2 typy dokumentów na osobę w projekcie. Minimum jeden typ musi mieć dokumenty zagnieżdżone
2. Opracowany model, wraz z propozycją najważniejszych/najbardziej rozbudowanych poleceń należy zatwierdzić u wykładowcy (ew. poprawić wg. sugestii)
3. Dla każdego typu dokumentu wygenerować min 100 sensownych instancji. Jeden z typów powinien mieć minimum 500 instancji. Dane można generować automatami typu generatedata.com bądź napisać 4 skrypt w pythonie (dodatkowe punkty).
4. Tak przygotowane dokumenty należy zaimportować do:
    - Wybranej bazy NoSQL
    - PostgreSQLa do kolumn typu JSONB
    - PostgreSQLa przy jednoczesnej konwersji JSON na tabele
5. Wszystkie 3 procesy importowania należy udokumentować screenshotami i zapisanymi wykorzystanymi poleceniami
6. Należy utworzyć min 4 zapytania na osobę realizujące najważniejsze problemy wyszukiwania w tworzonej bazie. 
7. Każde z zapytań musi mieć 3 wersje dla 3 sytuacji z pkt 4. 
8. Należy przeprowadzić eksperyment pomiaru czasu wykonania tych zapytań. Aby eksperyment był rzetelnie przeprowadzony, zarówno baza NoSQLowa, jak i PostgreSQL muszą operować w podobnych warunkach: albo obie bazy są postawione w osobnych dockerach, albo zainstalowane w tym samym OS, ale uruchamiane jedna na raz (proces instalacji musi być udokumentowany). Wyniki czasowe należy przedstawić w tabelce
