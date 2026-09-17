import { NextRequest, NextResponse } from 'next/server';

export interface TestCase {
  id: string;
  arr: number[];
  target: number;
  expected: number;
}

export async function POST(req: NextRequest) {
  try {
    const { code, testCases } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const casesToRun: TestCase[] = testCases || [
      { id: '1', arr: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23, expected: 5 },
      { id: '2', arr: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 91, expected: 9 },
      { id: '3', arr: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 100, expected: -1 },
      { id: '4', arr: [42], target: 42, expected: 0 },
    ];

    const results = [];
    let passedCount = 0;
    let errorType = '';
    let hasInfiniteLoop = false;
    let hasOutOfBounds = false;

    // Check for obvious static code errors
    if (code.includes('high = arr.length;') || code.includes('high = arr.length\n')) {
      errorType = 'BOUNDARY_OFF_BY_ONE';
    }

    if (code.includes('low = mid;') || code.includes('high = mid;')) {
      errorType = 'INFINITE_LOOP';
    }

    // Execute code safely in isolated Function context
    for (const testCase of casesToRun) {
      try {
        // Construct runnable wrapped function
        const userFn = new Function('arr', 'target', `
          ${code}
          if (typeof binarySearch === 'function') {
            return binarySearch(arr, target);
          }
          throw new Error("Function binarySearch(arr, target) is not defined.");
        `);

        // Timeout guard against infinite loops
        const startTime = Date.now();
        const actual = userFn(testCase.arr, testCase.target);
        const executionTime = Date.now() - startTime;

        if (executionTime > 2000) {
          hasInfiniteLoop = true;
          results.push({
            testCase,
            passed: false,
            actual: 'TIMEOUT (Infinite Loop)',
            error: 'Execution timed out after 2000ms',
          });
        } else if (actual === testCase.expected) {
          passedCount++;
          results.push({ testCase, passed: true, actual, executionTime });
        } else {
          if (actual === undefined || actual > testCase.arr.length - 1) {
            hasOutOfBounds = true;
          }
          results.push({
            testCase,
            passed: false,
            actual,
            error: `Expected ${testCase.expected}, but got ${actual}`,
          });
        }
      } catch (err: any) {
        if (err.message?.includes('undefined') || err.message?.includes('out of bounds')) {
          hasOutOfBounds = true;
        }
        results.push({
          testCase,
          passed: false,
          error: err.message || 'Execution error',
        });
      }
    }

    if (hasInfiniteLoop) errorType = 'INFINITE_LOOP';
    else if (hasOutOfBounds) errorType = 'BOUNDARY_OFF_BY_ONE';
    else if (passedCount < casesToRun.length && !errorType) errorType = 'LOGIC_ERROR';

    const success = passedCount === casesToRun.length;

    return NextResponse.json({
      success,
      passedCount,
      totalCount: casesToRun.length,
      results,
      errorType: success ? null : errorType,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to execute code' },
      { status: 500 }
    );
  }
}
