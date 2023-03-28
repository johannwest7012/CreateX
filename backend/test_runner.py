import os
import sys

import coverage


COVERAGE_MODULES = [
    'base',

    # Add more app names here.
]

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

    cov = coverage.Coverage(source=COVERAGE_MODULES)
    cov.erase()
    cov.start()

    # Run the tests.
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

    cov.stop()
    cov.save()

    # Print coverage report.
    cov.report()
